export function formatearDireccion(ubicacion: string) {
  if (!ubicacion) return "";

  const partes = ubicacion.split(",").map((s) => s.trim());
  if (partes.length < 3) return ubicacion;

  const provincia = partes[partes.length - 1];
  const localidad = partes[partes.length - 2];
  const calleNumeral = partes.slice(0, partes.length - 2).join(", ");

  // Separar la parte numérica del nombre de calle
  const regex = /^([^\d]+)?\s*(\d.*)?$/; // todo lo que no es número + el número
  const match = calleNumeral.match(regex);

  let calle = match?.[1]?.trim() || "";
  let numeral = match?.[2]?.trim() || "";

  // Agregar "Calle" solo si no existe
  if (calle && !/^calle/i.test(calle)) calle = "Calle " + calle;

  // Agregar "N°" solo si no existe y hay número
  if (numeral && !/^n/i.test(numeral)) numeral = "N° " + numeral;

  return [calle, numeral, localidad, provincia].filter(Boolean).join(", ");
}
