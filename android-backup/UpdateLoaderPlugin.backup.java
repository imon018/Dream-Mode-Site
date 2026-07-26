package com.dreammode.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "UpdateLoader")
public class UpdateLoaderPlugin extends Plugin {

    public void load(PluginCall call) {

        JSObject result = new JSObject();

        result.put(
            "message",
            "Update loader ready"
        );

        call.resolve(result);
    }
}
