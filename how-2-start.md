cd .\backend\
py -3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

cd .\frontend\
npm run dev -- --host

cd .\admin\
npm run dev -- --host