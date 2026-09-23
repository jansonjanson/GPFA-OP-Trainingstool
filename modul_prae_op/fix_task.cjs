const fs = require('fs');
let taskTsx = fs.readFileSync('src/components/TaskSection.tsx', 'utf8');

taskTsx = taskTsx.replace(
  `          <div>
            <h4 className="font-bold text-slate-900 mb-3">
          </div>`,
  ''
);

fs.writeFileSync('src/components/TaskSection.tsx', taskTsx);
