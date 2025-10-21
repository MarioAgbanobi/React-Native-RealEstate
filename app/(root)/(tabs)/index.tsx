import { FeaturedCard, PostCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="px-5">

          {/* Top Nav */}
          <View className="flex flex-row items-center justify-between mt-5">
            <View className="flex flex-row items-center">
              <Image source={images.avatar} className="size-12 rounded-full" />

              <View className="flex flex-col items-start ml-2 justify-center">
                <Text className="font-rubik-medium text-black-100 text-xs">
                  Good Morning
                </Text>
                <Text className="font-rubik-medium text-black-300 text-base">
                  Mario Agbanobi
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

            <View 
            className="flex flex-row gap-4"
            >
            <FeaturedCard />
            <FeaturedCard />
            </View>
          </View>

          {/* Filters */}
          <Filters />

          {/* PostCard */}
          <View className="mt-5 mb-20">
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

            <View 
            className="flex flex-row gap-4"
            >
              <PostCard />
              <PostCard />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
