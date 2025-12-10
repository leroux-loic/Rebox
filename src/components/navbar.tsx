"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Box, Flex, Button, HStack, Text, Icon, Menu, MenuButton, MenuList, MenuItem, Avatar, IconButton, useColorModeValue } from "@chakra-ui/react"
import { LogOut, Package, User, MessageCircle, LayoutDashboard } from "lucide-react"
import { NotificationsMenu } from "@/components/notifications-menu"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export function Navbar() {
    const { user, signOut } = useAuth()
    const [role, setRole] = useState<string | null>(null)
    const bg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

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

        if (data) {
            setRole((data as any).role)
        }
    }

    return (
        <Box
            as="nav"
            bg={useColorModeValue('whiteAlpha.800', 'gray.800')}
            borderBottom="1px"
            borderColor={borderColor}
            position="sticky"
            top="0"
            zIndex="sticky"
            backdropFilter="blur(10px)"
        >
            <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto" px={4}>
                <Link href="/" passHref>
                    <HStack spacing={2} cursor="pointer">
                        <Icon as={Package} w={6} h={6} color="brand.500" />
                        <Text fontSize="xl" fontWeight="bold" color="brand.600">ReBox</Text>
                    </HStack>
                </Link>

                <HStack spacing={4}>
                    {user ? (
                        <>
                            <Link href={role === 'company' ? "/dashboard/company" : "/dashboard/individual"}>
                                <Button variant="ghost" leftIcon={<Icon as={LayoutDashboard} />}>
                                    Tableau de bord
                                </Button>
                            </Link>
                            <Link href="/messages">
                                <Button variant="ghost" leftIcon={<Icon as={MessageCircle} />}>
                                    Messages
                                </Button>
                            </Link>

                            <NotificationsMenu />

                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'sm'}
                                        src={'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'}
                                    />
                                </MenuButton>
                                <MenuList>
                                    <Link href="/profile">
                                        <MenuItem icon={<Icon as={User} />}>Mon Profil</MenuItem>
                                    </Link>
                                    <MenuItem icon={<Icon as={LogOut} />} onClick={signOut}>Se déconnecter</MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost">Se connecter</Button>
                            </Link>
                            <Link href="/signup">
                                <Button colorScheme="brand">S'inscrire</Button>
                            </Link>
                        </>
                    )}
                </HStack>
            </Flex>
        </Box >
    )
}
