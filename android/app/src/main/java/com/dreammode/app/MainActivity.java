package com.dreammode.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {

        registerPlugin(UpdateLoaderPlugin.class);
        registerPlugin(LocalServerPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
