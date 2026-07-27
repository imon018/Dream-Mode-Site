package com.dreammode.app;

import android.os.Bundle;
import android.view.ViewGroup;
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

        // The WebView already has a parent (the layout set up by BridgeActivity's
        // super.onCreate()). It must be removed from that parent before it can be
        // added to a new one, otherwise Android throws
        // "IllegalStateException: The specified child already has a parent"
        // which crashes the app instantly on launch, before any screen is shown.
        ViewGroup currentParent = (ViewGroup) webView.getParent();
        if (currentParent != null) {
            currentParent.removeView(webView);
        }

        SwipeRefreshLayout swipe = new SwipeRefreshLayout(this);

        swipe.addView(webView);

        setContentView(swipe);

        swipe.setOnRefreshListener(() -> {

            getBridge().reload();

            swipe.setRefreshing(false);

        });

    }
}
