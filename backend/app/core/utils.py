import re
from typing import List

def generate_scifi_id(name: str) -> str:
    """
    Generates a Sci-fi ID using the Universal String-to-Decimal Formula.
    Structure: [SHORT_NAME]-SDC-[10_DIGIT_DECIMAL]
    """
    # 1. Extract Short Name: Uppercase consonants, max 4 chars
    # If no consonants, use first 4 letters
    clean_name = re.sub(r'[^a-zA-Z]', '', name).upper()
    consonants = re.sub(r'[AEIOU]', '', clean_name)
    
    if len(consonants) >= 2:
        short_name = consonants[:4]
    else:
        short_name = clean_name[:4]
        
    if not short_name:
        short_name = "NODE"

    # 2. Universal String-to-Decimal Formula: D(S) = sum(ASCII(Ci) * 131^(n-i))
    # n = len(S), Ci = character at position i
    # Multiplying by 131^(n-1) to ensure uniqueness
    decimal_val = 0
    n = len(name)
    for i, char in enumerate(name):
        decimal_val += ord(char) * (131 ** (n - 1 - i))
    
    # 3. Constrain to 10 digits as requested
    numeric_id = decimal_val % (10**10)
    
    # Format to exactly 10 digits with padding if needed
    numeric_str = f"{numeric_id:010d}"
    
    return f"{short_name}-SDC-{numeric_str}"

def get_consonants(s: str) -> str:
    return re.sub(r'[aeiouAEIOU]', '', s)
