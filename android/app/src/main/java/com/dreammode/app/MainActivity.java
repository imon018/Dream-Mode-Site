package com.dreammode.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        registerPlugin(UpdateLoaderPlugin.class);
        registerPlugin(LocalServerPlugin.class);

        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();

        // WebView-এর ভেতরে Passkey (WebAuthn: navigator.credentials.create/get)
        // কাজ করার জন্য এটা enable করা হচ্ছে। এটা কাজ করার জন্য ওয়েবসাইট
        // ডোমেইনে .well-known/assetlinks.json ফাইলটি সঠিকভাবে হোস্ট করা
        // থাকতে হবে (Digital Asset Links), নাহলে Android এটা silently
        // ignore করবে এবং সাইটে গিয়ে normal login ব্যবহার করতে হবে।
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_AUTHENTICATION)) {

            WebSettingsCompat.setWebAuthenticationSupport(
                webView.getSettings(),
                WebSettingsCompat.WEB_AUTHENTICATION_SUPPORT_FOR_APP
            );

        } else {

            Log.w("DreamMode", "This WebView does not support Passkeys (WebAuthn).");

        }

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
