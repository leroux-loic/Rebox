'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const colors = {
    brand: {
        50: '#eefdf6',
        100: '#d1f9e6',
        200: '#a7f1d1',
        300: '#6ee3b6',
        400: '#38ce96',
        500: '#008753', // Premium Forest Green
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
    },
    brown: {
        50: '#fef3c7',
        100: '#fde68a',
        200: '#f5d393',
        300: '#e3a85f',
        400: '#d97706',
        500: '#b45309', // Earthy Brown/Marron
        600: '#92400e',
        700: '#78350f',
        800: '#451a03',
        900: '#2d1402',
    },
    eco: {
        50: '#fdfbf7', // Eco Beige Background (No pure white)
        100: '#f7f2e9',
        200: '#eee4d1',
        300: '#e0ccaa',
        400: '#cdaa7d',
        500: '#b88d5e',
        600: '#a4734b',
        700: '#875b3e',
        800: '#6f4c36',
        900: '#5c3f2d',
    },
    white: '#fdfbf7', // Override global white to Eco-Beige
}

const theme = extendTheme({
    colors,
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
    },
    styles: {
        global: {
            body: {
                bg: 'eco.50', // NO PURE WHITE - ECO BEIGE
                color: 'brand.900'
            }
        }
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: 'xl',
                fontWeight: '600',
            }
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: '2xl',
                    bg: 'white', // This white will be slate.50 overridden if needed, but white handles shadows better. 
                    // Actually I'll use slate.50 for cards too if they want NO pure white.
                    // Let's use fafafa style.
                }
            }
        }
    }
})

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}
