import bcrypt from "bcrypt";

async function hashing(password, num) {
  try {
    let hash = await bcrypt.hash(password, num);
    return hash;
  } catch (error) {
    console.log(error);
  }
}

async function compare(hash, password) {
  try {
    let check = await bcrypt.compare(password, hash);
    return check;
  } catch (error) {
    console.log(error);
  }
}

// compare(
//   "$2b$10$DtHYcqlKiR0jJDBen6XNmuC8CED1Y8rJuHcLWtrBaeXOVc0wCREW2",
//   "123456"
// );

// hashing("123456", 10);
export { hashing, compare };
