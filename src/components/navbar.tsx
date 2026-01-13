"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Box, Flex, Button, HStack, VStack, Text, Icon, Menu, MenuButton, MenuList, MenuItem, Avatar, IconButton, useColorModeValue, InputGroup, InputLeftElement, Input, Badge, Container } from "@chakra-ui/react"
import { LogOut, Package, User, MessageCircle, LayoutDashboard, Search, PlusSquare, Heart, Bell, Menu as MenuIcon } from "lucide-react"
import { NotificationsMenu } from "@/components/notifications-menu"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { usePathname } from "next/navigation"

export function Navbar() {
    const { user, signOut } = useAuth()
    const pathname = usePathname()
    const [role, setRole] = useState<string | null>(null)

    const bg = useColorModeValue('white', 'gray.900')
    const borderColor = useColorModeValue('gray.100', 'gray.800')

    useEffect(() => {
        if (user) {
            fetchRole()
        }
    }, [user])

    const fetchRole = async () => {
        if (!user) return
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (data) setRole((data as any).role)
    }

    return (
        <Box
            as="nav"
            bg={bg}
            borderBottom="1px"
            borderColor={borderColor}
            position="sticky"
            top="0"
            zIndex="999"
            shadow="sm"
        >
            <Container maxW="container.xl" px={4}>
                <Flex h={{ base: 16, md: 20 }} alignItems="center" justifyContent="space-between" gap={8}>
                    {/* Logo Section */}
                    <Link href="/" passHref>
                        <HStack spacing={2} cursor="pointer" align="center" role="group">
                            <Flex bg="brand.500" w={10} h={10} borderRadius="lg" align="center" justify="center" shadow="md">
                                <Icon as={Package} w={6} h={6} color="white" />
                            </Flex>
                            <Box>
                                <Text fontSize="xl" fontWeight="900" color="brand.600" lineHeight="1">ReBox</Text>
                                <Text fontSize="xs" fontWeight="medium" color="gray.400" letterSpacing="wide">PRO</Text>
                            </Box>
                        </HStack>
                    </Link>

                    {/* Desktop: Middle Search Bar */}
                    <Box display={{ base: "none", lg: "block" }} flex={1} maxW="600px">
                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <Icon as={Search} color="gray.400" mt={1} />
                            </InputLeftElement>
                            <Input
                                placeholder="Rechercher des cartons, rouleaux, palettes..."
                                bg="gray.50"
                                border="1px solid"
                                borderColor="gray.200"
                                _focus={{ bg: "white", borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
                                borderRadius="full"
                                fontSize="sm"
                            />
                        </InputGroup>
                    </Box>

                    {/* Desktop Actions */}
                    <HStack spacing={4} display={{ base: "none", md: "flex" }} align="center">
                        <Link href="/dashboard/company/create">
                            <Button
                                leftIcon={<PlusSquare size={18} />}
                                colorScheme="brand"
                                variant="solid"
                                size="md"
                                borderRadius="full"
                                fontWeight="bold"
                                px={6}
                                boxShadow="md"
                                _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                            >
                                Déposer
                            </Button>
                        </Link>

                        <HStack spacing={1}>
                            <Link href="/favorites">
                                <IconButton aria-label="Favoris" icon={<Heart size={20} />} variant="ghost" borderRadius="full" color="gray.500" />
                            </Link>
                            {user && (
                                <Link href="/messages">
                                    <IconButton aria-label="Messages" icon={<MessageCircle size={20} />} variant="ghost" borderRadius="full" color="gray.500" />
                                </Link>
                            )}
                        </HStack>

                        {/* Auth Section */}
                        {user ? (
                            <Menu>
                                <MenuButton as={Button} variant="ghost" borderRadius="full" p={1} pr={4}>
                                    <HStack spacing={3}>
                                        <Avatar size="sm" name={user.email || undefined} src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                                        <VStack spacing={0} align="start" display={{ base: "none", xl: "flex" }}>
                                            <Text fontSize="sm" fontWeight="bold">{role === 'company' ? 'Entreprise' : 'Particulier'}</Text>
                                        </VStack>
                                    </HStack>
                                </MenuButton>
                                <MenuList borderRadius="xl" shadow="lg" p={2}>
                                    <Link href="/profile">
                                        <MenuItem borderRadius="md" icon={<Icon as={User} />}>Mon Compte</MenuItem>
                                    </Link>
                                    <Link href={role === 'company' ? "/dashboard/company" : "/dashboard/individual"}>
                                        <MenuItem borderRadius="md" icon={<Icon as={LayoutDashboard} />}>Tableau de Bord</MenuItem>
                                    </Link>
                                    <MenuItem borderRadius="md" icon={<Icon as={LogOut} />} onClick={signOut} color="red.500">Se déconnecter</MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" leftIcon={<User size={18} />}>Se connecter</Button>
                            </Link>
                        )}
                    </HStack>

                    {/* Mobile Menu Icon */}
                    <HStack display={{ base: "flex", md: "none" }} spacing={2}>
                        {user && <NotificationsMenu />}
                        <IconButton aria-label="Menu" icon={<MenuIcon />} variant="ghost" />
                    </HStack>
                </Flex>
            </Container>
        </Box >
    )
}
