import { View, Text, Image } from "react-native";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { Models } from "react-native-appwrite";

// Define a custom interface for your Appwrite table rows
export interface Property{
  $id: string;
  $createdAt: string;
  avatar?: string;
  name?: string;
  review?: string;
}

// Shared props for both cards
interface Props {
  item: Property;
  onPress?: () => void;
}

const Comment = ({ item: { avatar, name, review, $createdAt} }: Props) => {
  return (
    <View className="flex flex-col items-start">
      <View className="flex flex-row items-center">
        <Image source={{ uri: avatar }} className="size-14 rounded-full" />
        <Text className="text-base text-black-300 text-start font-rubik-bold ml-3">
          {name}
        </Text>
      </View>

      <Text className="text-black-200 text-base font-rubik mt-2">
        {review}
      </Text>

      <View className="flex flex-row items-center w-full justify-between mt-4">
        <View className="flex flex-row items-center">
          <Image
            source={icons.heart}
            className="size-5"
            tintColor={"#0061FF"}
          />
          <Text className="text-black-300 text-sm font-rubik-medium ml-2">
            120
          </Text>
        </View>
        <Text className="text-black-100 text-sm font-rubik">
          {new Date($createdAt).toDateString()}
        </Text>
      </View>
    </View>
  );
};

export default Comment;
