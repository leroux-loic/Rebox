"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Box, Flex, Button, HStack, VStack, Text, Icon, Menu, MenuButton, MenuList, MenuItem, Avatar, IconButton, useColorModeValue, InputGroup, InputLeftElement, Input, Badge, Container, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, Divider } from "@chakra-ui/react"
import { LogOut, Package, User, MessageCircle, LayoutDashboard, Search, PlusSquare, Heart, Bell, Menu as MenuIcon } from "lucide-react"
import { NotificationsMenu } from "@/components/notifications-menu"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { usePathname, useRouter } from "next/navigation"

export function Navbar() {
    const { user, signOut } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [role, setRole] = useState<string | null>(null)

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

    const handleSignOut = async () => {
        await signOut()
        onClose()
    }

    const bg = "rgba(253, 251, 247, 0.8)" // eco.50 with transparency
    const borderColor = "eco.100"

    return (
        <Box
            bg={bg}
            backdropFilter="blur(15px)"
            position="sticky"
            top="0"
            zIndex="sticky"
            borderBottom="1px"
            borderColor={borderColor}
            transition="all 0.3s"
        >
            <Container maxW="container.xl" py={4}>
                <Flex justify="space-between" align="center">
                    {/* Logo */}
                    <Link href="/">
                        <HStack spacing={3} _hover={{ transform: "scale(1.02)" }} transition="0.2s">
                            <Box
                                bg="brand.600"
                                p={2}
                                borderRadius="xl"
                                shadow="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={Package} color="white" boxSize={6} />
                            </Box>
                            <Text
                                fontSize="2xl"
                                fontWeight="900"
                                letterSpacing="tighter"
                                color="brand.900"
                                display={{ base: "none", sm: "block" }}
                            >
                                ReBox
                            </Text>
                        </HStack>
                    </Link>

                    {/* Navigation Desktop */}
                    <HStack spacing={8} display={{ base: "none", md: "flex" }}>
                        <Link href="/dashboard/individual">
                            <Text fontWeight="bold" color="brand.800" _hover={{ color: "brand.500" }} transition="0.2s" fontSize="sm">Acheter</Text>
                        </Link>
                        <Link href="/dashboard/company/create">
                            <Text fontWeight="bold" color="brand.800" _hover={{ color: "brand.500" }} transition="0.2s" fontSize="sm">Vendre</Text>
                        </Link>
                        <Link href="/pro">
                            <Text fontWeight="bold" color="brown.600" _hover={{ color: "brown.400" }} transition="0.2s" fontSize="sm">ReBox Pro</Text>
                        </Link>
                    </HStack>

                    {/* Actions */}
                    <HStack spacing={4}>
                        <Link href="/favorites">
                            <IconButton
                                aria-label="Favoris"
                                icon={<Heart size={20} />}
                                variant="ghost"
                                color="brand.700"
                                _hover={{ bg: "brand.50", color: "brand.500" }}
                                borderRadius="xl"
                                display={{ base: "none", sm: "flex" }}
                            />
                        </Link>

                        {user ? (
                            <Menu>
                                <MenuButton>
                                    <Avatar size="sm" name={user.email || undefined} src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} border="2px solid" borderColor="brand.100" />
                                </MenuButton>
                                <MenuList borderRadius="2xl" shadow="2xl" border="1px solid" borderColor="eco.100" p={2}>
                                    <MenuItem borderRadius="xl" fontWeight="bold" color="brand.800" _hover={{ bg: "brand.50" }} onClick={() => router.push('/profile')}>Profil</MenuItem>
                                    <MenuItem borderRadius="xl" fontWeight="bold" color="brand.800" _hover={{ bg: "brand.50" }} onClick={() => router.push('/dashboard')}>Dashboard</MenuItem>
                                    <MenuItem borderRadius="xl" fontWeight="bold" color="red.500" _hover={{ bg: "red.50" }} onClick={handleSignOut}>Déconnexion</MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <HStack spacing={3}>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        colorScheme="brand"
                                        fontWeight="black"
                                        borderRadius="xl"
                                    >
                                        Connexion
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button
                                        colorScheme="brand"
                                        px={6}
                                        borderRadius="xl"
                                        fontWeight="black"
                                        boxShadow="0 4px 12px rgba(0, 135, 83, 0.2)"
                                    >
                                        Rejoindre
                                    </Button>
                                </Link>
                            </HStack>
                        )}

                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            aria-label="Menu"
                            icon={<MenuIcon size={24} />}
                            variant="ghost"
                            color="brand.800"
                            onClick={onOpen}
                        />
                    </HStack>
                </Flex>
            </Container>

            {/* Mobile Sidebar */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay backdropFilter="blur(5px)" />
                <DrawerContent bg="eco.50" p={6}>
                    <DrawerCloseButton mt={4} mr={4} />
                    <VStack align="start" spacing={8} mt={12}>
                        <Link href="/dashboard/individual"><Text fontSize="xl" fontWeight="900" color="brand.900" onClick={onClose}>Acheter des cartons</Text></Link>
                        <Link href="/dashboard/company/create"><Text fontSize="xl" fontWeight="900" color="brand.900" onClick={onClose}>Vendre mes cartons</Text></Link>
                        <Link href="/favorites"><Text fontSize="xl" fontWeight="900" color="brand.900" onClick={onClose}>Mes Favoris</Text></Link>
                        <Link href="/pro"><Text fontSize="xl" fontWeight="900" color="brown.700" onClick={onClose}>Espace Professionnels</Text></Link>
                        <Divider />
                        {user ? (
                            <Button w="full" colorScheme="red" variant="ghost" onClick={handleSignOut} fontWeight="black">Déconnexion</Button>
                        ) : (
                            <VStack w="full" spacing={4}>
                                <Link href="/login" style={{ width: '100%' }}><Button w="full" variant="outline" borderColor="brand.500" color="brand.500" h={14} borderRadius="xl" fontWeight="black" onClick={onClose}>Connexion</Button></Link>
                                <Link href="/signup" style={{ width: '100%' }}><Button w="full" colorScheme="brand" h={14} borderRadius="xl" fontWeight="black" onClick={onClose}>Créer un compte</Button></Link>
                            </VStack>
                        )}
                    </VStack>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}
