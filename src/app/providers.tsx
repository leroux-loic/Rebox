'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const colors = {
    brand: {
        50: '#e0f5ea',
        100: '#b1e3ca',
        200: '#80d1aa',
        300: '#4ebf89',
        400: '#26ad6f',
        500: '#008753', // PREMIUM PRIMARY
        600: '#006d42',
        700: '#005331',
        800: '#003921',
        900: '#001f10',
    },
    accent: {
        50: '#fbf9f5',
        100: '#f2ece2',
        200: '#e5dccd', // PREMIUM SAND (Secondary)
        300: '#d7cbb6',
        400: '#c8bb9e',
        500: '#bba785',
        600: '#948366',
        700: '#6d6049',
        800: '#463d2e',
        900: '#201b13',
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
