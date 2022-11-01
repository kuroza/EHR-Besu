import random
from pyrsistent import b
from umbral import SecretKey, Signer, decrypt_reencrypted, encrypt, decrypt_original, generate_kfrags, reencrypt, CapsuleFrag

# Generate an Umbral key pair for sender
senders_secret_key = SecretKey.random()
senders_public_key = senders_secret_key.public_key()
print(senders_public_key)

senders_signing_key = SecretKey.random()
senders_verifying_key = senders_signing_key.public_key()
senders_signer = Signer(senders_signing_key)

# Encrypt with sender's public key
patient_files = b'https://bafybeieqize6534b5l3mam72zk33g3gi5zogsvbkdtgntg6xkhx3p67jzu.ipfs.w3s.link/'
capsule, encrypted_files = encrypt(senders_public_key, patient_files)
print(patient_files)
print(encrypted_files)

# Decrypt with sender's private key
decrypted_files = decrypt_original(senders_secret_key, capsule, encrypted_files)
print(decrypted_files)

# Threshold re-encryption
# Receiver exists
receivers_secret_key = SecretKey.random()
receivers_public_key = receivers_secret_key.public_key()
print(receivers_public_key)

# Sender grants access to receiver by generating kfrags
kfrags = generate_kfrags(delegating_sk=senders_secret_key, receiving_pk=receivers_public_key, signer=senders_signer, threshold=10, shares=20)

# Receiver receives a capsule
capsule = capsule
print(capsule)

# Receiver fails to open the capsule
# try:
#   fail = decrypt_original(delegating_sk=receivers_secret_key, capsule=capsule, encrypted_files=encrypted_files)
# except:
#   print("Decryption failed!")

# Ursulas perform re-encryption
kfrags = random.sample(kfrags, 10)
len(kfrags)

cfrags = list() # receiver's cfrag collection
for kfrag in kfrags:
  cfrag = reencrypt(capsule=capsule, kfrag=kfrag)
  cfrags.append(cfrag) # receiver collects a cfrag

# Decryption
# Receiver checks the capsule fragments
suspicious_cfrags = [CapsuleFrag.from_bytes(bytes(cfrag)) for cfrag in cfrags]
cfrags = [cfrag.verify(capsule, verifying_pk=senders_verifying_key, delegating_pk=senders_public_key, receiving_pk=receivers_public_key) for cfrag in suspicious_cfrags]

# Receiver opens the capsule
decrypted_files = decrypt_reencrypted(receiving_sk=receivers_secret_key, delegating_pk=senders_public_key, capsule=capsule, verified_cfrags=cfrags, ciphertext=encrypted_files)
print(decrypted_files)
