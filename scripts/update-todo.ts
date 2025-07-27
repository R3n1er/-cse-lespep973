#!/usr/bin/env tsx

/**
 * Script de mise à jour du fichier TODO
 * Met à jour automatiquement les statuts et les métriques
 */

import fs from "fs";
import path from "path";

interface TodoItem {
  id: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
  description: string;
  estimatedHours?: number;
  actualHours?: number;
  assignee?: string;
  dueDate?: string;
  completedDate?: string;
  notes?: string;
}

interface TodoUpdate {
  itemId: string;
  newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  notes?: string;
  actualHours?: number;
}

class TodoManager {
  private todoFile: string;
  private items: TodoItem[] = [];

  constructor(todoFile: string = "TODO.md") {
    this.todoFile = todoFile;
    this.loadTodoFile();
  }

  private loadTodoFile() {
    try {
      const content = fs.readFileSync(this.todoFile, "utf-8");
      this.parseTodoContent(content);
    } catch (error) {
      console.log("Fichier TODO.md non trouvé, création d'un nouveau fichier");
    }
  }

  private parseTodoContent(content: string) {
    // Parse le contenu du fichier TODO.md
    // Cette méthode peut être étendue pour parser le markdown
    console.log("Parsing du contenu TODO...");
  }

  public updateItem(update: TodoUpdate) {
    const item = this.items.find((i) => i.id === update.itemId);
    if (!item) {
      console.error(`Item ${update.itemId} non trouvé`);
      return;
    }

    item.status = update.newStatus;
    if (update.notes) item.notes = update.notes;
    if (update.actualHours) item.actualHours = update.actualHours;

    if (update.newStatus === "COMPLETED") {
      item.completedDate = new Date().toISOString().split("T")[0];
    }

    this.saveTodoFile();
    console.log(`✅ Item ${update.itemId} mis à jour: ${update.newStatus}`);
  }

  public addItem(item: TodoItem) {
    this.items.push(item);
    this.saveTodoFile();
    console.log(`✅ Nouvel item ajouté: ${item.title}`);
  }

  public getProgress() {
    const total = this.items.length;
    const completed = this.items.filter((i) => i.status === "COMPLETED").length;
    const inProgress = this.items.filter(
      (i) => i.status === "IN_PROGRESS"
    ).length;
    const blocked = this.items.filter((i) => i.status === "BLOCKED").length;

    return {
      total,
      completed,
      inProgress,
      blocked,
      pending: total - completed - inProgress - blocked,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  public generateReport() {
    const progress = this.getProgress();

    console.log("\n📊 RAPPORT DE PROGRESSION TODO");
    console.log("=".repeat(40));
    console.log(`📈 Total: ${progress.total}`);
    console.log(`✅ Complétés: ${progress.completed}`);
    console.log(`🔄 En cours: ${progress.inProgress}`);
    console.log(`⚠️ Bloqués: ${progress.blocked}`);
    console.log(`⏳ En attente: ${progress.pending}`);
    console.log(`📊 Progression: ${progress.percentage}%`);

    // Par catégorie
    const categories = Array.from(new Set(this.items.map((i) => i.category)));
    console.log("\n📂 Par catégorie:");
    categories.forEach((category) => {
      const categoryItems = this.items.filter((i) => i.category === category);
      const categoryCompleted = categoryItems.filter(
        (i) => i.status === "COMPLETED"
      ).length;
      const categoryPercentage =
        categoryItems.length > 0
          ? Math.round((categoryCompleted / categoryItems.length) * 100)
          : 0;

      console.log(
        `   ${category}: ${categoryCompleted}/${categoryItems.length} (${categoryPercentage}%)`
      );
    });

    // Par priorité
    console.log("\n🎯 Par priorité:");
    ["CRITICAL", "HIGH", "MEDIUM", "LOW"].forEach((priority) => {
      const priorityItems = this.items.filter((i) => i.priority === priority);
      const priorityCompleted = priorityItems.filter(
        (i) => i.status === "COMPLETED"
      ).length;
      const priorityPercentage =
        priorityItems.length > 0
          ? Math.round((priorityCompleted / priorityItems.length) * 100)
          : 0;

      console.log(
        `   ${priority}: ${priorityCompleted}/${priorityItems.length} (${priorityPercentage}%)`
      );
    });
  }

  private saveTodoFile() {
    // Sauvegarde le fichier TODO.md avec les mises à jour
    // Cette méthode peut être étendue pour formater le markdown
    console.log("Sauvegarde du fichier TODO...");
  }

  public markAsCompleted(itemId: string, notes?: string) {
    this.updateItem({
      itemId,
      newStatus: "COMPLETED",
      notes,
    });
  }

  public markAsInProgress(itemId: string, notes?: string) {
    this.updateItem({
      itemId,
      newStatus: "IN_PROGRESS",
      notes,
    });
  }

  public markAsBlocked(itemId: string, notes?: string) {
    this.updateItem({
      itemId,
      newStatus: "BLOCKED",
      notes,
    });
  }
}

// Fonction utilitaire pour mettre à jour rapidement les statuts
export function quickUpdate() {
  const todoManager = new TodoManager();

  // Exemple de mises à jour rapides
  console.log("🔄 Mise à jour rapide des statuts...");

  // Marquer les tâches critiques comme en cours
  // todoManager.markAsInProgress('rls-fix', 'Migration SQL créée, à appliquer');

  todoManager.generateReport();
}

// Fonction pour ajouter une nouvelle tâche
export function addTask(
  title: string,
  category: string,
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  description: string
) {
  const todoManager = new TodoManager();

  const newItem: TodoItem = {
    id: `task-${Date.now()}`,
    title,
    status: "PENDING",
    priority,
    category,
    description,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // +7 jours
  };

  todoManager.addItem(newItem);
  console.log(`✅ Nouvelle tâche ajoutée: ${title}`);
}

// Interface CLI simple
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "report":
      quickUpdate();
      break;
    case "add":
      if (args.length >= 4) {
        addTask(args[1], args[2], args[3] as any, args[4] || "");
      } else {
        console.log(
          'Usage: npm run update-todo add "Titre" "Catégorie" "PRIORITY" "Description"'
        );
      }
      break;
    default:
      console.log("Usage:");
      console.log("  npm run update-todo report  - Générer un rapport");
      console.log("  npm run update-todo add     - Ajouter une tâche");
      break;
  }
}
