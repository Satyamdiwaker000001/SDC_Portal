import 'styled-components';
import { Theme } from '../context/ThemeContext';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
