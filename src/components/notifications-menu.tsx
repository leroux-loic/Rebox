"use client"

import { useEffect, useState } from "react"
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Box,
    Text,
    Badge,
    VStack,
    HStack,
    Icon,
    useToast
} from "@chakra-ui/react"
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"

export function NotificationsMenu() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<any[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const toast = useToast()

    useEffect(() => {
        if (user) {
            fetchNotifications()

            // Subscribe to new notifications
            const channel = supabase
                .channel('notifications')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        setNotifications(prev => [payload.new, ...prev])
                        setUnreadCount(prev => prev + 1)
                        toast({
                            title: "Nouvelle notification",
                            description: payload.new.title,
                            status: "info",
                            duration: 3000,
                            isClosable: true,
                            position: "top-right"
                        })
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [user])

    const fetchNotifications = async () => {
        if (!user) return

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)

        if (data) {
            setNotifications(data)
            setUnreadCount(data.filter((n: any) => !n.read).length)
        }
    }

    const markAsRead = async (id: string) => {
        const { error } = await (supabase
            .from('notifications') as any)
            .update({ read: true })
            .eq('id', id)

        if (!error) {
            setNotifications((prev: any[]) => prev.map(n => n.id === id ? { ...n, read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <Icon as={CheckCircle} color="green.500" />
            case 'warning': return <Icon as={AlertTriangle} color="orange.500" />
            default: return <Icon as={Info} color="blue.500" />
        }
    }

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Notifications"
                icon={
                    <Box position="relative">
                        <Icon as={Bell} />
                        {unreadCount > 0 && (
                            <Badge
                                position="absolute"
                                top="-1px"
                                right="-1px"
                                colorScheme="red"
                                borderRadius="full"
                                boxSize="2"
                                border="2px solid white"
                            />
                        )}
                    </Box>
                }
                variant="ghost"
                rounded="full"
            />
            <MenuList maxH="400px" overflowY="auto" minW="300px">
                <Box px={4} py={2} borderBottomWidth="1px">
                    <Text fontWeight="bold">Notifications</Text>
                </Box>
                {notifications.length === 0 ? (
                    <Box p={4} textAlign="center">
                        <Text color="gray.500" fontSize="sm">Aucune notification</Text>
                    </Box>
                ) : (
                    notifications.map((notif) => (
                        <MenuItem key={notif.id} onClick={() => !notif.read && markAsRead(notif.id)} bg={notif.read ? "transparent" : "blue.50"}>
                            <HStack align="start" spacing={3} w="full">
                                <Box mt={1}>{getIcon(notif.type)}</Box>
                                <VStack align="start" spacing={0} flex={1}>
                                    <Text fontSize="sm" fontWeight={notif.read ? "normal" : "bold"}>
                                        {notif.title}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600" noOfLines={2}>
                                        {notif.message}
                                    </Text>
                                    <Text fontSize="xs" color="gray.400" pt={1}>
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </Text>
                                </VStack>
                                {!notif.read && <Box w={2} h={2} bg="blue.500" borderRadius="full" mt={2} />}
                            </HStack>
                        </MenuItem>
                    ))
                )}
            </MenuList>
        </Menu>
    )
}
