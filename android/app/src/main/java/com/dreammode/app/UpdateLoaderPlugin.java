package com.dreammode.app;

import android.content.Context;
import android.net.Uri;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;


@CapacitorPlugin(name = "UpdateLoader")
public class UpdateLoaderPlugin extends Plugin {


    @PluginMethod
    public void checkUpdate(PluginCall call) {

        Context context = getContext();

        File updateFolder = new File(
                context.getFilesDir(),
                "updates/package"
        );

        JSObject result = new JSObject();

        result.put(
                "available",
                updateFolder.exists()
        );

        if (updateFolder.exists()) {
            result.put(
                    "path",
                    updateFolder.getAbsolutePath()
            );
        }

        call.resolve(result);
    }



    @PluginMethod
    public void extractUpdate(PluginCall call) {

        try {

            Context context = getContext();


            File zipFile = new File(
                    context.getFilesDir(),
                    "updates/app.zip"
            );


            File outputFolder = new File(
                    context.getFilesDir(),
                    "updates/package"
            );


            if (!outputFolder.exists()) {
                outputFolder.mkdirs();
            }


            ZipInputStream zis =
                    new ZipInputStream(
                            new FileInputStream(zipFile)
                    );


            ZipEntry entry;


            while ((entry = zis.getNextEntry()) != null) {


                File newFile =
                        new File(
                                outputFolder,
                                entry.getName()
                        );


                if (entry.isDirectory()) {

                    newFile.mkdirs();

                } else {


                    File parent =
                            newFile.getParentFile();


                    if (parent != null) {
                        parent.mkdirs();
                    }


                    FileOutputStream fos =
                            new FileOutputStream(newFile);


                    byte[] buffer = new byte[1024];

                    int length;


                    while ((length = zis.read(buffer)) > 0) {

                        fos.write(
                                buffer,
                                0,
                                length
                        );
                    }


                    fos.close();
                }

                zis.closeEntry();
            }


            zis.close();


            JSObject result = new JSObject();

            result.put(
                    "success",
                    true
            );


            result.put(
                    "path",
                    outputFolder.getAbsolutePath()
            );


            call.resolve(result);



        } catch (Exception e) {


            call.reject(
                    "Extract failed: " + e.getMessage()
            );

        }
    }
}
