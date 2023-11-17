type Props = {
  label: string;
};
import './styles.css';
function Message({ label }: Props) {
  return (
    <div className="message">
      <div className="c-loader"></div>
      <p>{label}</p>
    </div>
  );
}

export default Message;
