import { useSearchParams } from 'react-router-dom';

function CallbackComponent() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    console.log(code);
    return (
        <div>
        </div>
    )
}

export default CallbackComponent;