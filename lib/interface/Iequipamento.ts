export interface IEquipamento {
  ID: number; // ID int AI PK
  ItemID: string; // ItemID int
  Descricao: string; // Descricao varchar(255)
  Categoria: "Diferencial" | "Manometrico" | "Absoluta"; // Categoria enum
  DataCadastro: Date; // DataCadastro timestamp
  Modelo: string; // Modelo varchar(255)
}
