import './styles.css';
import './font.css';
import { mount } from "svelte";
import Ui from "./ui.svelte";

mount(Ui, {
  target: document.getElementById("app")!
});