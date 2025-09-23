def test_register_login_refresh_and_me(client):
    r = client.post("/auth/register", json={"email": "u@example.com", "password": "supersecret"})
    assert r.status_code == 200
    tokens = r.json()
    assert "access_token" in tokens and "refresh_token" in tokens

    r = client.post("/auth/login", json={"email": "u@example.com", "password": "supersecret"})
    assert r.status_code == 200
    tokens = r.json()
    access = tokens["access_token"]
    refresh = tokens["refresh_token"]

    r = client.get("/users/me", headers={"Authorization": f"Bearer {access}"})
    assert r.status_code == 200
    me = r.json()
    assert me["email"] == "u@example.com"
    assert me["is_active"] is True

    r = client.post("/auth/refresh", json={"refresh_token": refresh})
    assert r.status_code == 200
    new_tokens = r.json()
    assert new_tokens["access_token"] != access
