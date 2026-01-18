export interface Table {
  _id: string;
  nombre: string;
  uid: string;
  estado: boolean;
  activo: boolean;
  qrUrl: string;
  peticionCamarero: boolean;
  peticionCuenta: boolean;
  updatedAt?: string;
}
