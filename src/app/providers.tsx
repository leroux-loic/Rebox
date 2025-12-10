'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const colors = {
    brand: {
        50: '#f2fcf5',
        100: '#e1f8e8',
        200: '#c3eed0',
        300: '#94deb0',
        400: '#5dc58a',
        500: '#36a668', // Forest Greenish
        600: '#268550',
        700: '#206a42',
        800: '#1d5437',
        900: '#18452f',
    },
    accent: {
        50: '#fbf7f3',
        100: '#f5ebe0', // Kraft
        200: '#ebdcc9',
        300: '#dfc8ad',
        400: '#d2b28e',
        500: '#c69d72',
        600: '#ba8a5b',
        700: '#9b7148',
        800: '#7f5c3d',
        900: '#664a32',
    }
}

const theme = extendTheme({ colors })

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}
