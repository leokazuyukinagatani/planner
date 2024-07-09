import { Input } from "@/components/input";
import { Image, Text, View } from "react-native";
import { MapPin, Calendar as IconCalendar } from "lucide-react-native";
import { colors } from "@/styles/colors";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={require("@/assets/logo.png")}
        className="h-8"
        resizeMode="contain"
      />
      <Text className=" text-zinc-400 font-regular text-center text-lg mt-3">
        Convide seus amigos e planeje sua{"\n"}próxima viagem
      </Text>
      <View className="w-ful  bg-zinc-900 p-4 rounded-xl my-8 mx-6 border-zinc-800 px-5">
        <Input>
          <MapPin color={colors.zinc[400]} />
          <Input.Field placeholder="Para onde?" />
        </Input>
        <Input>
          <IconCalendar color={colors.zinc[400]} />
          <Input.Field placeholder="Para onde?" />
        </Input>

        <View className="border-b py-3 border-zinc-800"></View>
      </View>
    </View>
  );
}
