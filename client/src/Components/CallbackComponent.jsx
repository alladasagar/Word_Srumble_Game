import { useSearchParams } from 'react-router-dom';

function CallbackComponent() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    // ... your logic to manage the code, send it to the server to get the access token ...
    console.log(code);
    return (
        <div>
            {/* ... */}
        </div>
    )
}

export default CallbackComponent;