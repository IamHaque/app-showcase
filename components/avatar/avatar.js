import { default as ImageAvatar } from "boring-avatars";

import styles from "./avatar.module.scss";

const AVATAR_COLOR_PALETTE = [
  "#E9A6A6",
  "#864879",
  "#A7D0CD",
  "#B85252",
  "#3C415C",
];

export default function Avatar({ name, square, style }) {
  return (
    <div className={styles.avatar} style={style}>
      <ImageAvatar
        name={name}
        variant={"beam"}
        colors={AVATAR_COLOR_PALETTE}
        square={square ? square : false}
      />
    </div>
  );
}
