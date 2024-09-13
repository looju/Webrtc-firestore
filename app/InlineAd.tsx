import { View } from "react-native";
import React, { useState } from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const androidBanner = "ca-app-pub-9324608119635871/3155777492"; //for production only

const InlineAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState<boolean>(false);
  return (
    <>
      <View style={{ height: isAdLoaded ? "auto" : 0 }}>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            setIsAdLoaded(true);
          }}
        />
      </View>
    </>
  );
};

export default InlineAd;
