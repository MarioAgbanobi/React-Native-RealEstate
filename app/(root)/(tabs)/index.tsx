import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-rubik-light text-3xl my-3">Welcome Real Esteem</Text>
      <Link href="/sign-in" >
          Sign in
      </Link>
      <Link href="/explore" >
          Explore
      </Link>
      <Link href="/profile" >
          Profile
      </Link>
      <Link href="/properties/[id]" >
          Property
      </Link>
      
    </View> 
  );
}
