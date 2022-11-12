import subprocess
import random
import os
from pyrsistent import b
from umbral import SecretKey, Signer, decrypt_reencrypted, encrypt, decrypt_original, generate_kfrags, reencrypt, CapsuleFrag

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJCODA1Nzk2ZDM0QTI2NTkyYTRmQTk4RGQxNzAwZTdGMkZhNDk4ODYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjIwMDg1MTkwODksIm5hbWUiOiJlaHItYmVzdSJ9.Lc710Rz1i0eg1SiPNW7ZB1MV6eWVK5ZzgAaoMZRvhsI"

def generate_patient_key_pair():
  patient_secret_key = SecretKey.random()
  patient_public_key = patient_secret_key.public_key()
  print(patient_public_key)

  patient_signing_key = SecretKey.random()
  patient_verifying_key = patient_signing_key.public_key()
  patient_signer = Signer(patient_signing_key)
  return patient_secret_key, patient_public_key, patient_signing_key, patient_signer, patient_verifying_key

def encrypt_files(path_to_files, path_to_encrypted_files, patient_public_key):
  patient_bundle = open(path_to_files, "rb").read()
  capsule, encrypted_files = encrypt(patient_public_key, patient_bundle)

  write_encrypted_data = open(path_to_encrypted_files, "wb")
  write_encrypted_data.write(encrypted_files)
  write_encrypted_data.close()

  print("Encrypted file content:")
  print(encrypted_files); print()
  return capsule, encrypted_files

def patient_decrypt_files():
  print("Decrypt with patient's private key\n")
  decrypted_files = decrypt_original(patient_secret_key, capsule, encrypted_files)
  print(decrypted_files)
  return decrypted_files

def store_encrypted_files(path_to_script):
  cid = subprocess.run(["node", path_to_script], capture_output=True, text=True)
  print("Stored files with CID:")
  print(cid.stdout)

def generate_doctor_key_pair():
  doctor_secret_key = SecretKey.random()
  doctor_public_key = doctor_secret_key.public_key()
  print(doctor_public_key)
  return doctor_secret_key, doctor_public_key

print("\n**************** Proxy re-encryption *****************\n")

print("1 Generating key pair for patient...\n")
patient_secret_key, patient_public_key, patient_signing_key, patient_signer, patient_verifying_key = generate_patient_key_pair()

print("\n******************************************************\n")
print("2 Encrypting files with patient's public key...\n")
capsule, encrypted_files = encrypt_files("/mnt/c/Users/assid/Workspace/EHR-Besu/src/pyUmbral/unencrypted_files/patient-data.txt", "/mnt/c/Users/assid/Workspace/EHR-Besu/src/pyUmbral/encrypted_files/patient-data.txt", patient_public_key)

print("\n******************************************************\n")
print("3 Storing encrypted files on IPFS...\n")
store_encrypted_files('/mnt/c/Users/assid/Workspace/EHR-Besu/src/web3-storage/file-storage.js')

print("\n******************************************************\n")
print("4-A Doctor sends request to blockchain for access to patient's data...")
print("4-B Generating key pair for doctor...\n")
doctor_secret_key, doctor_public_key = generate_doctor_key_pair()

print("\n******************************************************\n")
print("\n5 Patient grants access to doctor by generating kfrags...\n")
kfrags = generate_kfrags(delegating_sk=patient_secret_key, receiving_pk=doctor_public_key, signer=patient_signer, threshold=10, shares=20)

print("\n******************************************************\n")
print("6 Doctor retrieves encrypted files from IPFS and capsule...\n")
# os.system("node ../web3-storage/file-retrieve.js")
# os.system("ipfs get {cid}")

capsule = capsule
print(capsule)

print("\n******************************************************\n")
print("7 Ursulas perform re-encryption...")
kfrags = random.sample(kfrags, 10)
len(kfrags)

print("\n******************************************************\n")
print("8 Doctor collects and checks capsule fragments")
cfrags = list() # doctor's cfrag collection
for kfrag in kfrags:
  cfrag = reencrypt(capsule=capsule, kfrag=kfrag)
  cfrags.append(cfrag) # doctor collects a cfrag

suspicious_cfrags = [CapsuleFrag.from_bytes(bytes(cfrag)) for cfrag in cfrags]
cfrags = [cfrag.verify(capsule, verifying_pk=patient_verifying_key, delegating_pk=patient_public_key, receiving_pk=doctor_public_key) for cfrag in suspicious_cfrags]

print("\n******************************************************\n")
print("9 Doctor opens capsule and decrypts file...\n")
retrieve_encrypted_file = open("/mnt/c/Users/assid/Workspace/EHR-Besu/src/pyUmbral/encrypted_files/patient-data.txt", "rb").read()
decrypted_file = decrypt_reencrypted(receiving_sk=doctor_secret_key, delegating_pk=patient_public_key, capsule=capsule, verified_cfrags=cfrags, ciphertext=retrieve_encrypted_file)

write_decrypted_data = open("/mnt/c/Users/assid/Workspace/EHR-Besu/src/pyUmbral/decrypted_files/patient-data.txt", "wb")
write_decrypted_data.write(decrypted_file)
write_decrypted_data.close()
print("Contents of decrypted file:")
print(decrypted_file); print()