const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Get all .ts, .tsx, .js, .jsx files
function getAllSourceFiles(dir) {
    const files = [];
    function walk(d) {
        const entries = fs.readdirSync(d, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(d, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
                files.push(fullPath);
            }
        }
    }
    walk(dir);
    return files;
}

// Extract import paths from a file
function extractImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    // Match import ... from '...' and import '...'
    const importRegex = /from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1] || match[2];
        if (importPath && !importPath.startsWith('.') && !importPath.startsWith('/')) {
            // external package, ignore
            continue;
        }
        imports.push(importPath);
    }
    return imports;
}

function main() {
    const sourceFiles = getAllSourceFiles(srcDir);
    console.log(`Found ${sourceFiles.length} source files.`);

    // Map from relative import path to absolute file path
    const importToFile = new Map();
    for (const file of sourceFiles) {
        const rel = path.relative(srcDir, file).replace(/\\/g, '/');
        // Without extension
        const basename = rel.replace(/\.(ts|tsx|js|jsx)$/, '');
        importToFile.set('./' + basename, file);
        importToFile.set(basename, file);
        // Also with index
        if (basename.endsWith('/index')) {
            importToFile.set(basename.slice(0, -6), file);
        }
    }

    // Build dependency graph
    const used = new Set();
    for (const file of sourceFiles) {
        const imports = extractImports(file);
        for (const imp of imports) {
            if (!imp) continue;
            // Resolve import relative to current file's directory
            const dir = path.dirname(file);
            let resolved;
            if (imp.startsWith('.')) {
                resolved = path.resolve(dir, imp);
                // Normalize extension
                if (!fs.existsSync(resolved) && !fs.existsSync(resolved + '.ts') && !fs.existsSync(resolved + '.tsx')) {
                    // Try with extensions
                    const possible = [resolved + '.ts', resolved + '.tsx', resolved + '.js', resolved + '.jsx', resolved + '/index.ts', resolved + '/index.tsx'];
                    for (const p of possible) {
                        if (fs.existsSync(p)) {
                            resolved = p;
                            break;
                        }
                    }
                }
            } else {
                // absolute or alias - skip
                continue;
            }
            if (fs.existsSync(resolved)) {
                used.add(resolved);
            }
        }
    }

    // Also mark entry points as used
    const entryPoints = [
        path.join(srcDir, 'main.tsx'),
        path.join(srcDir, 'App.tsx'),
    ];
    entryPoints.forEach(ep => used.add(ep));

    // Find unused files
    const unused = sourceFiles.filter(f => !used.has(f));
    console.log('\n=== UNUSED FILES ===');
    unused.forEach(f => {
        const rel = path.relative(srcDir, f);
        console.log(rel);
    });
    console.log(`\nTotal unused: ${unused.length}`);
}

main();