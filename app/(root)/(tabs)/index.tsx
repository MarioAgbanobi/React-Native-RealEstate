import { FeaturedCard, PostCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useGlobalContext } from "@/lib/global-provider";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user, refetch } = useGlobalContext();

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList 
      data={[1,2,3,4]}
      renderItem={({item}) => <PostCard /> }
      keyExtractor={(item) => item.toString()}
      numColumns={2}
      contentContainerClassName="pb-32"
      columnWrapperClassName="flex gap-5 px-5"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View className="px-5">

          {/* Top Nav */}
          <View className="flex flex-row items-center justify-between mt-5">
            <View className="flex flex-row items-center">
              <Image source={
                              user?.avatar 
                                ? { uri: user?.avatar }
                                : images.avatar
                            } className="size-12 rounded-full" />

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

            <FlatList 
            data={[1,2,3,4]}
            renderItem={({item}) => <FeaturedCard /> }
            keyExtractor={(item) => item.toString()}
            horizontal
            bounces={false}
            contentContainerClassName="flex gap-5 mt-5"
            showsHorizontalScrollIndicator={false}
            />
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
