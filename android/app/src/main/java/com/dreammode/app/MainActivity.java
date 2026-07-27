package com.dreammode.app;

import android.os.Bundle;
import android.webkit.WebView;

import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        registerPlugin(UpdateLoaderPlugin.class);
        registerPlugin(LocalServerPlugin.class);

        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();

        SwipeRefreshLayout swipe = new SwipeRefreshLayout(this);

        swipe.addView(webView);

        setContentView(swipe);

        swipe.setOnRefreshListener(() -> {

            getBridge().reload();

            swipe.setRefreshing(false);

        });

    }
}
