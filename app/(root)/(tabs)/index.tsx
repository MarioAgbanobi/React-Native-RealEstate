import { FeaturedCard, PostCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useGlobalContext();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({
      fn: getLatestProperties,
    });

  const {
    data: properties,
    refetch,
    loading,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: undefined,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: undefined,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList 
        data={properties}
        numColumns={2}
        renderItem={({ item }) => (
          <PostCard item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
         loading ? (
          <ActivityIndicator size="large" className="text-primary-300 mt-5"/>
         ) : ( <NoResults /> )
        }
        ListHeaderComponent={
          <View className="px-5">

            {/* Top Nav */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image 
                  source={
                    user?.avatar 
                      ? { uri: user?.avatar }
                      : images.avatar
                  } 
                  className="size-12 rounded-full" 
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="font-rubik-medium text-black-100 text-xs">
                    Good Morning
                  </Text>
                  <Text className="font-rubik-medium text-black-300 text-base capitalize">
                    {user?.name || 'Guest User'}
                  </Text>
                </View>
              </View>

              <Image source={icons.bell} className="size-6" />
            </View>

            {/* Search */}
            <Search />

            {/* FeaturedCard */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="font-rubik-bold text-xl">Featured</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {
              latestPropertiesLoading ? <ActivityIndicator 
              size="large" 
              className="text-primary-300"/> : !latestProperties || latestProperties.length === 0 ? ( <NoResults /> ) : (
              <FlatList 
                data={latestProperties}
                renderItem={({ item }) => (
                  <FeaturedCard 
                    item={item} 
                    onPress={() => handleCardPress(item.$id)} 
                  /> 
                )}
                keyExtractor={(item) => item.$id}
                horizontal
                bounces={false}
                contentContainerClassName="flex gap-5 mt-5"
                showsHorizontalScrollIndicator={false}
              />
              )
              }

            </View>

            {/* Filters */}
            <Filters />

            {/* PostCard */}
            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="font-rubik-bold text-xl">
                  Our Recommendation
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        }
      />
        
    </SafeAreaView>
  );
}