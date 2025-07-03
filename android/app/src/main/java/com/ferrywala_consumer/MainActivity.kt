// android/app/src/main/java/com/ferrywala_consumer/MainActivity.kt
package com.ferrywala_consumer

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String {
        return "Ferrywala_Consumer"
    }

    /**
     * Returns the instance of the [ReactActivityDelegate]. Here we use a util class [DefaultReactActivityDelegate]
     * which allows you to easily enable Fabric and Concurrent React (aka React 18) with flags.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(
            this,
            mainComponentName!!,  // Add !! to ensure non-null
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            fabricEnabled  // Use the property directly
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
    }
}