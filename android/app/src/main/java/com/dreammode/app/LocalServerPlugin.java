package com.dreammode.app;

import android.content.Context;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;


@CapacitorPlugin(name = "LocalServer")
public class LocalServerPlugin extends Plugin {


    private ServerSocket serverSocket;
    private Thread serverThread;
    private int port = 8765;


    @PluginMethod
    public void startServer(PluginCall call) {


        try {

            Context context = getContext();


            File webFolder =
                    new File(
                            context.getFilesDir(),
                            "updates/package"
                    );


            if (!webFolder.exists()) {

                JSObject result = new JSObject();

                result.put(
                        "available",
                        false
                );

                call.resolve(result);

                return;
            }


            if (serverThread == null) {


                serverThread = new Thread(() -> {


                    try {


                        serverSocket =
                                new ServerSocket(port);


                        while (!serverSocket.isClosed()) {


                            Socket socket =
                                    serverSocket.accept();


                            handleRequest(
                                    socket,
                                    webFolder
                            );

                        }


                    } catch(Exception ignored) {

                    }


                });


                serverThread.start();

            }



            JSObject result = new JSObject();


            result.put(
                    "available",
                    true
            );


            result.put(
                    "url",
                    "http://127.0.0.1:" + port + "/index.html"
            );


            call.resolve(result);



        } catch(Exception e) {


            call.reject(
                    "Server failed: " + e.getMessage()
            );

        }
    }



    private void handleRequest(
            Socket socket,
            File folder
    ) throws IOException {


        String request =
                new java.io.BufferedReader(
                        new java.io.InputStreamReader(
                                socket.getInputStream()
                        )
                ).readLine();


        String path = "/index.html";


        if(request != null && request.contains(" ")) {

            path =
                request.split(" ")[1];

        }


        File file =
                new File(
                        folder,
                        path
                );


        if(!file.exists()) {

            file =
                new File(
                        folder,
                        "index.html"
                );
        }


        OutputStream output =
                socket.getOutputStream();


        output.write(
                (
                "HTTP/1.1 200 OK\r\n" +
                "Content-Type: " + getMimeType(file.getName()) + "\r\n" +
                "Connection: close\r\n\r\n"
                ).getBytes()
        );


        FileInputStream input =
                new FileInputStream(file);


        byte[] buffer =
                new byte[4096];


        int length;


        while(
            (length = input.read(buffer)) > 0
        ) {

            output.write(
                    buffer,
                    0,
                    length
            );

        }


        input.close();

        output.close();

        socket.close();
    }


    private String getMimeType(String fileName) {

        String lower = fileName.toLowerCase();

        if (lower.endsWith(".html")) return "text/html";
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".ico")) return "image/x-icon";
        if (lower.endsWith(".webmanifest")) return "application/manifest+json";
        if (lower.endsWith(".woff2")) return "font/woff2";
        if (lower.endsWith(".woff")) return "font/woff";

        return "application/octet-stream";
    }
}
