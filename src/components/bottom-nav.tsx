"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Flex, VStack, Text, Icon, useColorModeValue } from "@chakra-ui/react"
import { Home, Heart, PlusSquare, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export function BottomNav() {
    const pathname = usePathname()
    const { user } = useAuth()
    const bg = useColorModeValue("white", "gray.800")
    const borderColor = useColorModeValue("gray.200", "gray.700")

    // Hide on login/signup pages or if defined
    if (pathname === '/login' || pathname === '/signup') return null

    const NavItem = ({ href, icon, label, isActive }: { href: string, icon: any, label: string, isActive: boolean }) => (
        <Link href={href} style={{ flex: 1 }}>
            <VStack spacing={1} py={3} justify="center" align="center" cursor="pointer" color={isActive ? "brand.600" : "gray.500"}>
                <Icon as={icon} w={6} h={6} strokeWidth={isActive ? 2.5 : 2} fill={isActive && label === 'Favoris' ? "currentColor" : "none"} />
                <Text fontSize="10px" fontWeight={isActive ? "bold" : "normal"}>{label}</Text>
            </VStack>
        </Link>
    )

    // Center "Post" button is special
    const PostButton = () => (
        <Link href="/dashboard/company/create" style={{ flex: 1 }}>
            <VStack spacing={1} py={2} justify="center" align="center" cursor="pointer" mt={-6}>
                <Box bg="brand.500" p={3} borderRadius="full" shadow="lg" border="4px solid" borderColor={bg}>
                    <Icon as={PlusSquare} w={6} h={6} color="white" />
                </Box>
                <Text fontSize="10px" fontWeight="bold" color="gray.600">Publier</Text>
            </VStack>
        </Link>
    )

    return (
        <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            bg={bg}
            borderTop="1px"
            borderColor={borderColor}
            pb="safe-area-inset-bottom"
            zIndex="sticky"
            display={{ base: "block", md: "none" }}
            boxShadow="0 -1px 3px rgba(0,0,0,0.05)"
        >
            <Flex justify="space-between" align="center" px={2}>
                <NavItem href="/" icon={Home} label="Rechercher" isActive={pathname === '/'} />
                <NavItem href="/favorites" icon={Heart} label="Favoris" isActive={pathname === '/favorites'} />
                <PostButton />
                <NavItem href="/messages" icon={MessageCircle} label="Messages" isActive={pathname?.startsWith('/messages')} />
                <NavItem href={user ? "/profile" : "/login"} icon={User} label={user ? "Compte" : "Se connecter"} isActive={pathname === '/profile'} />
            </Flex>
        </Box>
    )
}
