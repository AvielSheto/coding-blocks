import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
// Editor
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import 'ace-builds/src-noconflict/theme-monokai';
import "ace-builds/src-noconflict/ext-language_tools";

function CodeBlock() {
    const { name: roomName } = useParams();
    const [code, setCode] = useState();
    const [editorSocket, setEditorSocket] = useState();
    const [mentor, setMentor] = useState(false);
    const [solution, setSolution] = useState();
    const [showSmile, setShowSmile] = useState(false);

    useEffect(() => {
        const socket = io("http://localhost:3001");
        // const socket = io("https://code-block-server-production.up.railway.app/");
        setEditorSocket(socket);

        socket.on("connect", () => console.log("Hello user ID : " + socket.id));

        socket.on("connect_error", () => {
            setTimeout(() => socket.connect(), 5000);
        });

        socket.on("disconnect", () => console.log("server disconnected"));

        // Get code by room name
        socket.emit("get-document", roomName);

        // Get code from DB
        socket.once("load-document", (document) => {
            setCode(document.code);
            setSolution(document.solution);
        });

        // Get code changes
        socket.on("receive-changes", (code) => {
            setCode(code)
        });

        // Get number of users in room
        socket.on("users-counter", userCount => {
            if (userCount === 1) setMentor(true)
        });

        return () => {
            socket.disconnect()
        }
    }, [roomName])

    const handleChange = (editorValue) => {
        setCode(editorValue);
        editorSocket.emit("send-changes", editorValue);
        editorSocket.emit("save-document", editorValue);
        editorValue === solution ? setShowSmile(true) : setShowSmile(false)
    }

    return (
        <>
            <h1 style={{ textAlign: "center" }}>{roomName}</h1>
            <div style={{ display: "flex", justifyContent: "center" }}>

                {showSmile &&
                    <div style={{
                        height: "100px",
                        width: "100px",
                        position: "absolute",
                        top: "55vh",
                        zIndex: "2",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAyVBMVEX71DP///8UFRgAABb/2DT/2jT/2zT70yoQEhj70h4AABX70RENEBj70y370iX70iAFCxfwyzL833X+8cb955r71TjRsS3/+ur71j/++OP72lj84Hr+8MH84X///vr1zzLkwTA7NBvmwjDcui/+89D+9tqBbiNxYSGylynCpCuzmCn844n72En96KD83GVDOxwmIxn966z955seHRlaTh6jiidQRh1LQR1kVh8uKhojIRmLdyRvXyF8aiKHcySojyj97bWXgSXIqixp0xLoAAAPnUlEQVR4nN2d6ULqOheGW5K2hNIBZBIZVNAtgqjHCba6He7/or60QBnapJkK5XvPn31+VPOYZA3JSqLpmavXHHYea+PptD1ptepavd6atKfVce2xMzztZf/rtSx/ePPkrtuuezbyXMtyHEdbCf/bslwPIVRvn911TrNsRFaEzZPaFKO51horWU5AarfHnWZGLcmCsNnpthBy09i2ORFqdTOhVE44HE9sL7Xnkik9ezIeqm6QUsLeyZmLhOgiShe5Zycq26SSMMSToFvJQlZXYU+qIjwdq8GLIGuqDKwawk7bdpXhLeTa046StikgbNY8JDP3SHKQV1NgXKUJT8+Q6u5by/W60oyShFdTW93sS5Jln0lOSClCzJfF8NxhRFUpRgnCZnUPfCGjfSYxVoUJe+OMx+cWI6oJZyGihI9udvYlSa4j6jvECK8maK98gVBbbDoKEY73NAG35aDangiHzn4H6FpeXSBe5SbsdQ/SgQs59jhzwsN14EJu6ypbwtoBO3Ahx77LkLDX3r8JjQtNuXwjD+HQ2p+Pp8nSeEYqB+GdfWi0lRz7MQvCah5G6EroTDlhb3JYG7ort806GRkJT6VW0LKQVWfMN9gIh5ksU8jJ8dgCHCbCx9zYmC3ZTAurLIQ5BcSILBkVA2F+vERMLF4jnfC//AIyIaYS5hqQBTGNMMdDdKFUxBTC3BqZtexvGcLv/AOmOg0q4ckxAGJEaqpBI7zKU6xNk0cL4CiETa6d+EPKqVPCcArh5FgAcRjeFiGc5itdossl54tEwtqxTMKFENEtkgiPxIyuRTSoBMLmcfWgFhSSEawNgfCIrMxK1pSHsOYdur0CQslLxYmEw2ObhAslT8Ukwp5z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")`
                    }}>
                    </div>
                }
                <AceEditor
                    readOnly={mentor}
                    mode="javascript"
                    theme="monokai"
                    value={code}
                    enableLiveAutocompletion={true}
                    onChange={(e) => handleChange(e)}
                    editorProps={{ $blockScrolling: true }}
                />
            </div>
        </>
    );
}

export default CodeBlock;
