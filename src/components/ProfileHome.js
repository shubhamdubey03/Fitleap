import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileSidebar from './ProfileSidebar';

const ProfileHome = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Top Header */}
      <TouchableOpacity
        style={{ marginTop: 50, marginLeft: 20 }}
        onPress={() => setSidebarVisible(true)}
      >
        <Ionicons name="menu-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Dashboard UI yahin rahega (charts, cards, etc) */}

      {/* Sidebar Modal */}
      <ProfileSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </View>
  );
};

export default ProfileHome;
