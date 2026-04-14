"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Flex, VStack, Text, Icon, useColorModeValue } from "@chakra-ui/react"
import { Home, Heart, PlusSquare, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export function BottomNav() {
    const pathname = usePathname()
    const { user } = useAuth()
    const bg = "rgb(253, 251, 247)" // eco.50
    const borderColor = "rgb(238, 228, 209)" // eco.200

    if (pathname === '/login' || pathname === '/signup') return null

    const NavItem = ({ href, icon, label, isActive }: { href: string, icon: any, label: string, isActive: boolean }) => (
        <Link href={href} style={{ flex: 1 }}>
            <VStack spacing={1} py={3} justify="center" align="center" cursor="pointer" color={isActive ? "brand.500" : "brown.300"}>
                <Icon as={icon} w={isActive ? 7 : 6} h={isActive ? 7 : 6} strokeWidth={isActive ? 2.5 : 2} />
                <Text fontSize="10px" fontWeight={isActive ? "900" : "bold"}>{label}</Text>
            </VStack>
        </Link>
    )

    const PostButton = () => (
        <Link href="/dashboard/company/create" style={{ flex: 1 }}>
            <VStack spacing={1} py={2} justify="center" align="center" cursor="pointer" mt={-8}>
                <Box
                    bg="brand.500"
                    p={4}
                    borderRadius="2xl"
                    shadow="dark-lg"
                    border="4px solid"
                    borderColor={bg}
                    boxShadow="0 10px 15px -3px rgba(0, 135, 83, 0.4)"
                >
                    <Icon as={PlusSquare} w={7} h={7} color="white" />
                </Box>
                <Text fontSize="10px" fontWeight="black" color="brand.600">Publier</Text>
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
            pb="env(safe-area-inset-bottom)"
            zIndex="sticky"
            display={{ base: "block", md: "none" }}
            backdropFilter="blur(10px)"
        >
            <Flex justify="space-between" align="center" px={4} h={16}>
                <NavItem href="/" icon={Home} label="Home" isActive={pathname === '/'} />
                <NavItem href="/favorites" icon={Heart} label="Favoris" isActive={pathname === '/favorites'} />
                <PostButton />
                <NavItem href="/messages" icon={MessageCircle} label="Messages" isActive={pathname?.startsWith('/messages')} />
                <NavItem href={user ? "/profile" : "/login"} icon={User} label="Moi" isActive={pathname === '/profile'} />
            </Flex>
        </Box>
    )
}
