interface ItemType {
  label: string;
  value: string | number | boolean;
}

export interface ToggleType {
  items: ItemType[];
  value: string | number | boolean;
  onChange?: (data: string | number | boolean) => void;
}
