import icons from '@/constants/icons'
import images from '@/constants/images'
import { login, logout } from '@/lib/appwrite'
import { useGlobalContext } from '@/lib/global-provider'
import { Redirect } from 'expo-router'
import React from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignIn = () => {
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  // Redirect if already logged in
  if (isLoggedIn) {
    return <Redirect href="/(root)/(tabs)" />
  }

  const handleLogin = async () => {
    try {
      console.log('Starting login...');

      // Check if user is already logged in, then log out first
      if (isLoggedIn) {
        console.log('User already logged in, logging out first...');
        await logout();
      }
      
      const result = await login();

      if (result) {
        console.log('Login successful');
        await refetch();
        // User will be auto-redirected due to isLogged check above
      } else {
        Alert.alert('Error', 'Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login.');
    }
  }

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
        <Image
          source={images.onboarding}
          className='w-full h-4/6' 
          resizeMode='contain'
        />
        <View className='px-10'>
          <Text className='text-base text-center uppercase font-rubik text-black-200'>
            Welcome to Real Esteem
          </Text>

          <Text className='text-3xl font-rubik-bold text-black-300 text-center mt-2'>
            Let's Get You Closer to <Text className='text-primary-300'>Your Ideal Home</Text>
          </Text>

          <Text className='text-base text-center text-black-200 mt-4'>
            Sign in to Real Esteem with Google.
          </Text>

          <TouchableOpacity 
            onPress={handleLogin}  // Removed the arrow function wrapper
            className='bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5'
            disabled={loading}  // Disable button while loading
          >
            <View className='flex flex-row justify-center items-center'>
              <Image 
                source={icons.google}
                className='w-5 h-5'
                resizeMode='contain'
              />
              <Text className='text-lg font-rubik-medium text-black-300 ml-2'>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn