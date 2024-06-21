export function emailValidator(value: string): boolean {
  // [^\s@à-ú(\\)\\"[\]@<>,;:] = Accept all characters different than space,
  // @, vogals from á to ù independent of case, (), [], ",", ";", ":", <>, \, ´ and "
  const reg = new RegExp(
    /^[^\s@à-ú(\\)\\"[\]@<>,;:´]+@[^\s@à-ú(\\)\\"[\]@<>,;:´]+\.[^\s@à-ú(\\)\\"[\]@<>,;:´]+$/gi,
  );
  return reg.test(value);
}
