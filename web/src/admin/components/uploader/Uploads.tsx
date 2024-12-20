import api from "../../../core/services/HttpClient";

export function Uploads() {
  const getUploads = () => {
    api.get(`${import.meta.env.VITE_BACKEND_URL}/uploads`, {
      timeout: import.meta.env.VITE_TIMEOUT
    }).then((res: any) => {
      console.log(res);
    });
  };
  return (
    <div>
      <button className="primary-button" onClick={getUploads}>Get</button>
    </div>
  );
}
