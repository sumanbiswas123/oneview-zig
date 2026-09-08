const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const webview_dep = b.dependency("webview", .{
        .target = target,
        .optimize = optimize,
    });

    const exe = b.addExecutable(.{
        .name = "oneview",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
        }),
    });

    exe.subsystem = .Windows;
    exe.root_module.addImport("webview", webview_dep.module("webview"));


    exe.root_module.addIncludePath(b.path("third_party/webview2"));
    exe.root_module.addCSourceFile(.{
        .file = b.path("src/child_webview.cpp"),
        .flags = &.{ "-std=c++20" },
    });
    exe.root_module.link_libcpp = true;
    exe.root_module.linkSystemLibrary("ole32", .{});
    exe.root_module.linkSystemLibrary("oleaut32", .{});
    exe.root_module.linkSystemLibrary("user32", .{});
    exe.root_module.linkSystemLibrary("shell32", .{});
    exe.root_module.linkSystemLibrary("shlwapi", .{});
    exe.root_module.linkSystemLibrary("urlmon", .{});
    exe.root_module.linkSystemLibrary("wininet", .{});

    exe.root_module.addWin32ResourceFile(.{ .file = b.path("src/resources.rc") });
    b.installArtifact(exe);
    b.installFile("WebView2Loader.dll", "bin/WebView2Loader.dll");



    const run = b.addRunArtifact(exe);
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run.step);
}
