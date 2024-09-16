export default {
    execute: function(args, terminal) {
        const runs = 150000000;
        const start = performance.now();
        for (let i = runs; i > 0; i--) {}
        const end = performance.now();
        const ms = end - start;
        const cyclesPerRun = 2;
        const speed = (runs / ms / 1000000) * cyclesPerRun;
        const ghz = Math.round(speed * 10) / 10;

        let vendor = "unknown";
        let renderer = "unknown";

        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (gl) {
                const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
                if (debugInfo) {
                    vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                } else {
                    throw new Error("WEBGL_debug_renderer_info not available");
                }
            } else {
                throw new Error("WebGL not supported");
            }
        } catch (error) {
            terminal.printError(`Couldn't access GPU info: ${error.message}`);
        }

        terminal.printTable([
            ["Logical CPU cores", navigator.hardwareConcurrency],
            ["Platform (guess)", navigator.platform],
            ["CPU clockspeed (guess)", `${ghz} GHz`],
            ["GPU vendor", vendor],
            ["GPU renderer", renderer]
        ]);
    },
    description: "Get some helpful info about your CPU and GPU"
};
