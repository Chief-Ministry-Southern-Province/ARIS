import { createContext} from 'react'
import type { ThemeContextValue } from '../types/theme.type'

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
)