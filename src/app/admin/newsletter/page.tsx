"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Send,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";

export default function AdminNewsletterPage() {
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    previewMode: false,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Simulation des utilisateurs actifs qui recevront la newsletter
  const activeUsers = 142;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.content) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setSending(true);

    // Envoyer la newsletter via l'API
    try {
      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: formData.subject,
          content: formData.content,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      setSending(false);
      setSent(true);
      // Réinitialiser le formulaire
      setFormData({ subject: "", content: "", previewMode: false });

      console.log("Newsletter envoyée:", result);
    } catch (error) {
      setSending(false);
      console.error("Erreur:", error);
      alert(
        `Erreur lors de l'envoi: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    }
  };

  const togglePreview = () => {
    setFormData((prev) => ({ ...prev, previewMode: !prev.previewMode }));
  };

  if (sent) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto bg-green-50 border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-900">
              Newsletter envoyée avec succès !
            </CardTitle>
            <CardDescription className="text-green-700">
              La newsletter a été envoyée à {activeUsers} utilisateurs actifs du
              CSE
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => setSent(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Envoyer une nouvelle newsletter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Gestion Newsletter</h1>
        <p className="text-gray-600 mt-2">
          Envoyez des communications automatiquement à tous les membres actifs
          du CSE
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire d'envoi */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Composer une Newsletter
              </CardTitle>
              <CardDescription>
                Cette newsletter sera envoyée automatiquement à tous les
                utilisateurs actifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Sujet de l'email</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Ex: Nouvelles activités du CSE - Janvier 2025"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Contenu de la newsletter</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Rédigez le contenu de votre newsletter ici..."
                    rows={12}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Vous pouvez utiliser du HTML simple pour le formatage
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={togglePreview}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {formData.previewMode ? "Éditer" : "Aperçu"}
                  </Button>

                  <Button
                    type="submit"
                    disabled={sending || !formData.subject || !formData.content}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    {sending ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Envoyer à {activeUsers} utilisateurs
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Aperçu */}
          {formData.previewMode && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Aperçu de l'email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="mb-4 pb-2 border-b">
                    <p className="text-sm text-gray-600">Sujet:</p>
                    <p className="font-semibold">
                      {formData.subject || "Pas de sujet"}
                    </p>
                  </div>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formData.content || "<p>Pas de contenu</p>",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informations sur les destinataires */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Users className="h-5 w-5" />
                Destinataires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {activeUsers}
                </div>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
              </div>

              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-center">
                  Envoi automatique
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  Membres bénéficiaires uniquement
                </Badge>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>• Comptes activés seulement</p>
                <p>• Salariés membres du CSE</p>
                <p>• Email valide et vérifié</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Important
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 text-sm space-y-2">
              <p>
                <strong>Envoi automatique :</strong> La newsletter sera envoyée
                immédiatement à tous les utilisateurs actifs.
              </p>
              <p>
                <strong>Pas de désabonnement :</strong> Les membres du CSE
                reçoivent automatiquement les communications officielles.
              </p>
              <p>
                <strong>Traçabilité :</strong> L'envoi sera tracé pour suivi et
                conformité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Historique récent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Dernière newsletter</span>
                  <span className="text-gray-500">15 Jan 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux d'ouverture</span>
                  <span className="text-green-600">85%</span>
                </div>
                <div className="flex justify-between">
                  <span>Destinataires</span>
                  <span className="text-gray-500">138 utilisateurs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
