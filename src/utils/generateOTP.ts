export function generateOTP(length: number): string {
  const numbers = "0123456789";
  let loginCode = "";
  for (let i = 0; i < length; i++) {
    loginCode += numbers[Math.floor(Math.random() * 10)];
  }
  return loginCode;
}
