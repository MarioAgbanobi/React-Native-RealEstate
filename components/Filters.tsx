import { categories } from '@/constants/data';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Filters = () => {
    const params = useLocalSearchParams<{filter?: string}>();
    const [selectedCategory, setSelectedCategory] = useState(params.filter || 'All');

    const handleCatgeroryPress = (category: string) => {

        if (selectedCategory === category) {
            setSelectedCategory('All');
            router.setParams({filter: "All"});
            return
        }

        setSelectedCategory(category);
        router.setParams({ filter: category });
    }

  return (
    <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className='mt-3 mb-2'
    >
      {categories.map((item, index) => (
        <TouchableOpacity
        onPress={() => handleCatgeroryPress(item.category)}
        key={index}
        className={`flex flex-col items-start mr-2 px-4 py-2 rounded-full ${selectedCategory === item.category ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`}
        >
        <Text className={`text-sm font-rubik ${selectedCategory === item.category ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300'}`}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default Filters