package com.dreammode.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        registerPlugin(UpdateLoaderPlugin.class);
        registerPlugin(LocalServerPlugin.class);

        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();

        // যখন WebView-এর ভেতর থেকে কোনো ডাউনলোড রিকোয়েস্ট আসে (যেমন <a href download> বা
        // কোনো ফাইল লিংক), সেটা আমরা নিজে হ্যান্ডেল না করে সিস্টেমের ডিফল্ট ব্রাউজারে
        // (Chrome) পাঠিয়ে দিচ্ছি — ঠিক যেভাবে এটা মোবাইল ব্রাউজারে স্বাভাবিকভাবে কাজ করে।
        webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } catch (ActivityNotFoundException e) {
                Toast.makeText(this, "ডাউনলোড হ্যান্ডেল করার মতো কোনো অ্যাপ পাওয়া যায়নি", Toast.LENGTH_SHORT).show();
            }
        });

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
